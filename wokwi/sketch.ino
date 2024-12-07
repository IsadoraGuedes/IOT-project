#include <PubSubClient.h>
#include <WiFi.h>

#define POTENTIOMETER_PIN 34
#define BUTTON_PIN 14
#define LED_PIN 2
#define TOPIC_PUBLISH "topic_sensor_desconforto_nicisa"

const char *SSID = "Wokwi-GUEST"; // Wi-Fi SSID
const char *PASSWORD = "";        // Wi-Fi password
const char *BROKER_MQTT = "broker.hivemq.com";
const char *CLIENTID = "ESP32-wokwi";

WiFiClient espClient;
PubSubClient client(espClient);

bool buttonState = false;
bool lastButtonState = false;

void setup_wifi() {
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Wi-Fi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect(CLIENTID)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(POTENTIOMETER_PIN, INPUT);
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  setup_wifi();
  client.setServer(BROKER_MQTT, 1883);

  lastButtonState = digitalRead(BUTTON_PIN);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (WiFi.status() == WL_CONNECTED && client.connected()) {
    digitalWrite(LED_PIN, HIGH); // Keep LED on when connected
  } else {
    digitalWrite(LED_PIN, LOW); // Turn off LED if disconnected
  }

  bool currentButtonState = digitalRead(BUTTON_PIN) == LOW;
  if (currentButtonState && !lastButtonState) {
    float potentiometerValue = analogRead(POTENTIOMETER_PIN);
    Serial.print("Raw potentiometer value: ");
    Serial.println(potentiometerValue);

    float voltage = potentiometerValue * (3.3 / 4095.0);
    char message[50];
    sprintf(message, "%.2f", voltage);
    Serial.println(message);

    client.publish(TOPIC_PUBLISH, message);
  }

  lastButtonState = currentButtonState;
}