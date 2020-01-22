import os
import jwt
import hashlib
from flask import Flask
from flask import request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__, static_url_path='/static')
CORS(app)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Nikhil@123'
app.config['MYSQL_DB'] = 'twitter'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)


def hash_password(password):
    """Hash Password"""

    hash = hashlib.md5()
    hash.update(password.encode('utf-8'))
    return hash.hexdigest()


def generate_salt():
    """Create a salt"""

    salt = os.urandom(16)
    return salt.hex()


def generate_password(string):
    """Hash the password"""

    password = hash_password(string)
    for _ in range(100):
        password = hash_password(password)
    return password


def decode_token(token):
    """Decode Token"""

    encoded_token = token.split(" ")[1]
    return jwt.decode(encoded_token, 'nikhil', algorithms=['HS256'])


@app.route('/')
def test_route():
    """Test route"""

    return 'This is a test route'


@app.route('/register', methods=['POST'])
def create_user():
    """Register New User"""
    
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    email = request.json["email"]
    password = request.json["password"]
    salt = generate_salt()
    password_hash = generate_password(password+salt)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """INSERT INTO users (first_name, last_name, email, salt, password) values (%s, %s, %s, %s, %s)""", (
            first_name, last_name, email, salt, password_hash,)
    )
    mysql.connection.commit()
    cursor.close()

    return {"status": 201}


@app.route('/login', methods=['POST'])
def login_user():
    """User Login"""

    email = request.json["email"]
    password = request.json["password"]
    password_hash = generate_password(password)

    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * from users WHERE email = %s""", (email,)
    )
    results = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()

    for i in results:
        salt = i["salt"]
        if i["password"] == generate_password(password+salt):
            token = jwt.encode({"id": i["id"]}, 'nikhil', algorithm='HS256')
            return {"first_name": i["first_name"], "last_name": i["last_name"], "email": i["email"], "picture": i["profile_picture"], "token": token}
    return {"status": 401}


@app.route('/user/picture', methods = ['POST'])
def upload_file():
    """Upload Profile Picture"""

    auth_header = request.headers.get('Authorization')
    user_id = decode_token(auth_header)["id"]
    if request.method == 'POST':
        f = request.files['picture']
        location = "static/img/" + f.filename
        f.save(location)

        cursor = mysql.connection.cursor()
        cursor.execute(
            """UPDATE users SET profile_picture = %s WHERE id = %s """, 
            (location, str(user_id),)
        )

        mysql.connection.commit()
        cursor.close()
        return {"path": location}
    
@app.route('/create/tweet', methods=['POST'])
def create_tweet():
    """Create Tweet"""

    auth_header = request.headers.get('Authorization')
    user_id = decode_token(auth_header)["id"]
    tweet = request.json["tweet"]

    cursor = mysql.connection.cursor()
    cursor.execute(
        """INSERT INTO tweets (user_id, tweet_body) values (%s, %s)""", (str(user_id), tweet)
    )

    mysql.connection.commit()
    cursor.close()

    return {"status": 200}

@app.route('/profile', methods=['GET'])
def profile_tweets():
    """Show User Tweets"""

    auth_header = request.headers.get('Authorization')
    user_id = decode_token(auth_header)["id"]

    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM tweets WHERE user_id = %s""", (str(user_id))
    )

    tweets = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()

    return jsonify(tweets)


@app.route('/read/users', methods=['GET'])
def read_users():
    """Read Users"""

    auth_header = request.headers.get('Authorization')
    user_id = decode_token(auth_header)["id"]

    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT email, first_name, last_name, id, profile_picture FROM users WHERE id != %s""", (str(user_id))
    )

    users = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()

    return jsonify(users)

@app.route('/follow', methods=['POST'])
def follow_users():
    """Follow Other Users"""

    auth_header = request.headers.get('Authorization')
    user_id = decode_token(auth_header)["id"]
    followee_id = request.json["followee_id"]

    cursor = mysql.connection.cursor()
    cursor.execute(
        """INSERT INTO followers (follower_id, followee_id) values (%s, %s)""", (str(user_id), str(followee_id))
    )

    mysql.connection.commit()

    cursor.execute(
        """SELECT followee_id FROM followers WHERE follower_id = 1;"""
    )


    followees = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()

    return jsonify(followees)


@app.route('/read/tweets', methods=['GET'])
def read_tweets():
    """Read Tweets"""

    auth_header = request.headers.get('Authorization')
    user_id = decode_token(auth_header)["id"]
    offset = request.args.get('offset', default=0, type=int)
    limit = 20

    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT * FROM tweets WHERE user_id in (SELECT followee_id FROM followers where follower_id = %s) ORDER BY id DESC LIMIT %s, %s""", (str(user_id), offset, limit)
    )

# """SELECT * FROM tweets WHERE user_id in (SELECT followee_id FROM followers where follower_id = %s) ORDER BY id DESC LIMIT %s, %s""", (str(user_id), 0, 2)

# select * from (select tweets.id as tweet_id, tweets.tweet_body, users.id as user_id, users.last_name, users.first_name from tweets join users on tweets.user_id = users.id) as tab where user_id != 1;

    tweets = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()

    return jsonify(tweets)