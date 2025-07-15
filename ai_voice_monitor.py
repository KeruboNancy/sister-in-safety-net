# pip install SpeechRecognition
# pip install pyaudio

import speech_recognition as sr

# ================================
# 🔑 Modular Keyword Categories
# ================================

# English distress keywords
english_keywords = ['help', 'stop', 'no', 'afraid', 'pain', 'robbery', 'emergency']

# Kiswahili distress keywords (based on common phrases used in distress)
# Kiswahili distress keywords (based on common phrases used in distress)
kiswahili_keywords = [
    'saidia',     # help
    'acha',       # stop
    'hapana',     # no
    'naogopa',    # I'm afraid
    'maumivu',    # pain
    'wezi',       # robbers
    'hatari',     # danger
    'naibiwa',    # I'm being robbed
    'polisi',     # police
    'mwizi',      # thief
    'napigwa'     # I'm being beaten
]

# Combine both sets into one unified list
all_keywords = english_keywords + kiswahili_keywords

# Optional: Language info for UI display (if connected)
supported_languages = ['English', 'Kiswahili']

# ================================
# 🎤 Voice Monitoring Function
# ================================

def listen_for_keywords():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("🎧 Voice monitoring activated. Listening for distress keywords...")
    print(f"🌐 Supported languages: {', '.join(supported_languages)}")  # UI suggestion

    while True:
        try:
            with mic as source:
                recognizer.adjust_for_ambient_noise(source)
                audio = recognizer.listen(source, timeout=5)
                text = recognizer.recognize_google(audio).lower()
                print("Heard:", text)

                # Check for any distress keyword
                for word in all_keywords:
                    if word in text:
                        print("🚨 Distress keyword detected:", word)
                        trigger_alert(word)
                        break

        except sr.WaitTimeoutError:
            print("No speech detected.")
        except sr.UnknownValueError:
            print("Couldn't understand audio.")
        except sr.RequestError as e:
            print("API error:", e)

# ================================
# 🚨 Trigger Alert Action
# ================================

def trigger_alert(keyword):
    print(f"🔔 Alert triggered! Keyword detected: {keyword}")
    # Here you could add: send email, update DB, call another script etc.

# ================================
# ▶️ Main
# ================================

if __name__ == "__main__":
    listen_for_keywords()
