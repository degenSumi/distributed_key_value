Current Deployed Nodes:
  https://distributed-key-value.onrender.com
  https://distributed-key-value-1.onrender.com

API endpoints:
  Get:
    Sample Request:
    https://distributed-key-value-1.onrender.com/api/get?key=hey
  POST: 
    Sample Request:
      curl --location 'https://distributed-key-value.onrender.com/api/put' \
          --header 'Content-Type: application/json' \
          --data '{
              "hey": "there"
          }'



Note: Nodes are hosted on Render free tier so there is a 50 sec bootup period after inactivity


High Level Design
![image](https://github.com/user-attachments/assets/fa787473-8729-44f5-b0b0-293ed6ae568a)
