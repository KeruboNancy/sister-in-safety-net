# 🛡️ SafeSister – Sister in Safety Net

**Visual Representation** https://safesister.netlify.app/
**Pitchdeck Presentation**https://www.canva.com/design/DAGtbopMWuA/ww6MpcGD6K3wj2DZHPumAg/view?utm_content=DAGtbopMWuA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h23b0c80328

**SafeSister** is an AI-powered, web-based safety app designed to help women discreetly signal distress through a panic button or voice activation. Built with TypeScript, HTML/CSS, and Python, it combines a responsive UI with voice keyword detection to act quickly in emergencies-especially for women in Kenya and similar regions.

---

## 💡 Project Summary

SafeSister is a lightweight, mobile-friendly safety solution featuring:
- A panic alert button
- Voice-activated distress word detection using AI
- A clean and accessible web interface
- Scalable features for SMS/email alerts and real-time tracking

---

## 🌍 Problem

Many women face safety threats in public and private spaces. Most safety apps are complex, heavy on data, or unreliable during actual emergencies. SafeSister solves this by offering a fast, accessible tool made for Kenyan women — usable even under pressure or poor connectivity.

---

## 🔐 Key Features

- 🚨 One-tap panic button
- 🎙️ AI-powered voice detection of distress words like “help”, “stop”, etc.
- 📱 Mobile-first HTML/CSS UI
- 🧠 Lightweight AI script (Python)
- 🌐 Planned expansion: SMS/email alerts, location sharing

---

## 🛠️ Tech Stack

| Layer           | Technology                        |
|------------------|------------------------------------|
| UI / Frontend    | HTML, CSS                         |
| Scripting        | TypeScript (`index.ts`)           |
| AI / Voice       | Python, SpeechRecognition         |
| Package Manager  | Node.js (`package.json`, `.lock`) |
| Planned Backend  | Flask API + Twilio (future work)  |

---

## 🧠 How the AI Works

The `ai_voice_monitor.py` script listens through your microphone for emergency keywords and prints alerts to the terminal. You can expand it to send real-time messages via SMS or email.

### 🔄 Run it locally:
```bash
pip install SpeechRecognition pyaudio
python ai_voice_monitor.py

** 🚀 How to Use
Clone the repo
git clone https://github.com/KeruboNancy/sister-in-safety-net.git
cd sister-in-safety-net
Install Python AI dependencies
pip install SpeechRecognition pyaudio
Run AI script

bash
Copy
Edit
python ai_voice_monitor.py
Open the UI

Open index.html in your browser to access the panic button interface.

Future JavaScript/TypeScript features will enhance interactivity.
