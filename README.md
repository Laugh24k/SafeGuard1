# SafeGuard: Cybersecurity Education and Phishing Awareness

## 🚨 Educational Disclaimer
The "SafeGuard" project is designed for **educational purposes only**. It serves to illustrate the methods used in phishing attacks and to emphasize cybersecurity best practices. This project is intended for use in a controlled, consensual environment. It is **not** to be used for illegal or unethical activities of any kind.

## 🎯 Overview
SafeGuard simulates realistic phishing scenarios to teach users how to recognize fraudulent attempts seeking sensitive information. By using Python, Flask, and the Telegram API, this project demonstrates how individuals might be tricked into providing personal data, showing the importance of measures such as Two-Factor Authentication (2FA) in real-time.

### Key Features
- Simulation of phishing techniques using a cloned website.
- Real-time educational feedback for participants.
- Demonstration of data transmission through the Telegram API.
- Emphasis on the importance and setup of 2FA.

## 🔧 Built With
- [Python](https://www.python.org/) - The backend programming language used.
- [Flask](https://flask.palletsprojects.com/) - The web framework used.
- [Telegram API](https://core.telegram.org/api) - Used to simulate the transmission of sensitive information securely.

## 🛠 Getting Started

### Prerequisites
- Knowledge that this is a simulated environment for education.
- Informed consent from all participants.
- Python enviroment and project requirements.

### Installation
```
# Clone the repository
git clone https://github.com/wolketich/SafeGuard.git

# Navigate to the repository directory
cd SafeGuard

# Install Python dependencies
pip install -r requirements.txt
```

## 🚀 Usage
Provide detailed instructions on how to initiate the simulation, including any environment setup, Flask server initialization, and participant interaction steps.

```

# Set up the environment variables (if any), by creating an .env file with following content
TELEGRAM_API_TOKEN='your_token_here'

# Run the cloned website

# Run the Flask server from this repository
flask run

# The server should start, and the simulation is ready for access on the local network
# Direct participants to access the server address (provide detailed steps)
```

## 👨‍🏫 Educational Scenario
1. **Start at the Event Booking**: Participants visit the mock booking site and choose an event.
2. **Redirection**: They are then redirected to a fake Instagram login page, simulating a common phishing tactic.
3. **Data Transmission Simulation**: Showcases how entered data could be transmitted insecurely by simulating an API transmission to Telegram.


## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact
Vladislav Cernega – vladislav@walkcat.net

Project Link: [https://github.com/wolketich/SafeGuard](https://github.com/wolketich/SafeGuard)

---

### 📚 Resources
- [Understanding Phishing](https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams)
- [Setting Up 2FA](https://authy.com/what-is-2fa/)

---
