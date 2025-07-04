# pip install SpeechRecognition
# pip install pyaudio

import speech_recognition as sr

# Distress keywords to monitor
keywords = ['help', 'stop', 'no', 'afraid', 'pain', 'robbery', 'emergency']

def listen_for_keywords():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    print("🎧 Voice monitoring activated. Listening for distress keywords...")

    while True:
        try:
            with mic as source:
                recognizer.adjust_for_ambient_noise(source)
                audio = recognizer.listen(source, timeout=5)
                text = recognizer.recognize_google(audio).lower()
                print("Heard:", text)

                for word in keywords:
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

def trigger_alert(keyword):
    print(f"🔔 Alert triggered! Keyword detected: {keyword}")
    # Here you could add: send email, update DB, call another script etc.

if __name__ == "__main__":
    listen_for_keywords()
