import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
const mqttUrl = "ws://localhost:8000/mqtt";


const Notifications = () => {
  const mqttClient = mqtt.connect(mqttUrl);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("#", (err) => {
        if (err) {
          console.error("Error subscribing to topic:", err);
        }
      });
    });

  }, []);
  mqttClient.on("message", (topic, msg) => {
    setMessage(msg.toString());
    setTimeout(() => setMessage(null), 5000);
  });
  
  return (
    <div>
      {message && (
        <div className="fixed bottom-5 left-5 bg-green-500 text-white p-4 rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default Notifications;
