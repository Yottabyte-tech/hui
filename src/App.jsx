import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER = "wss://421c9c79af754eb5b4f4bfa658dda4a1.s1.eu.hivemq.cloud:8884/mqtt";
const MQTT_USERNAME = "Yottabyte";
const MQTT_PASSWORD = "ThisIsMyWebPage1";
const MQTT_TOPIC = "myinfo/esp32/counter"; // Same topic your ESP32 publishes to

function App() {


  const [subs, setSubs] = useState(null);
  const [connected, setConnected] = useState(false);



  useEffect(() => {
    // Connect options including authentication
    const options = {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      keepalive: 30,
      clean: true,
      reconnectPeriod: 1000,
    };


    const parseData = (data) => {
      setSubs(data.split(",")[1]);
    }

    // Connect to MQTT broker via WebSocket (wss)
    const client = mqtt.connect(MQTT_BROKER, options);

    client.on("connect", () => {
      setConnected(true);
      console.log("Connected to MQTT broker");
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          console.error("Subscribe error:", err);
        }
      });
    });

    client.on("message", (topic, message) => {
      if (topic === MQTT_TOPIC) {
        const msg = message.toString();
        parseData(msg);
      }
    });

    client.on("error", (err) => {
      console.error("Connection error: ", err);
      client.end();
    });

    client.on("close", () => {
      setConnected(false);
      console.log("Disconnected from MQTT broker");
    });

    // Cleanup on unmount
    return () => {
      if (client.connected) client.end();
    };
  }, []);

  return (
    <div>
      <h1>Yottabyte</h1>
      <p>Status: {connected ? "Connected" : "Disconnected"}</p>
      <p>
        Current Count:{" "}
        {subs !== null ? <strong>{subs}</strong> : "Waiting for data..."}
      </p>
    </div>
  );
}

export default App;
