

# Distributed Key-Value Store

This is a simple distributed key-value store with multiple nodes hosted on Render. **Note:** Since nodes are hosted on Render’s free tier, there is a 50-second bootup time after inactivity.

## Instructions for Starting Your Own Node and Adding It to the Global Network

Follow these steps:

1. Open the `index.js` file.
2. In the `add_node` function, replace `<fill_me>` with your public IP address. This will add/sync the node with the distributed key-value store network.

### Current Deployed Nodes:
- [Node 1](https://distributed-key-value.onrender.com)
- [Node 2](https://distributed-key-value-1.onrender.com)

### API Endpoints

#### GET:
**Sample Request:**
```
https://distributed-key-value-1.onrender.com/api/get?key=hey
```

#### POST: 
**Sample Request:**
```bash
curl --location 'https://distributed-key-value.onrender.com/api/put' \
--header 'Content-Type: application/json' \
--data '{
    "hey": "there"
}'
```

### High-Level Design

![Distributed Key-Value Store Design](https://github.com/user-attachments/assets/fa787473-8729-44f5-b0b0-293ed6ae568a)

---

To fully utilize multiple threads, you can use PM2.
