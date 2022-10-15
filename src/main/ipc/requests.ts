const { SocksProxyAgent } = require('socks-proxy-agent');
import axios from 'axios';

const agent = new SocksProxyAgent('socks5h://127.0.0.1:9150');

export async function testTor(e: any) {
  try {
    await axios.get('http://31.172.67.157:9000/ems', {
      httpAgent: agent,
    });
    return true;
  }
  catch (e) {
    return false;
  }
}

export async function testHub(e: any, hub: string, useTor: boolean) {
  try {
    const req = await axios.get(hub + '/ems', useTor ? {
      httpAgent: agent,
    } : {});

    return req.status === 200;
  }
  catch (e) {
    return false;
  }
};

export async function getChannelMessages(
  e: any, 
  hub: string, 
  channel: string, 
  limit: number, 
  offset: number,
  useTor: boolean,
) {
  try {
    const req = await axios.get(hub + `/ems/messages/${channel}?limit=${limit}&offset=${offset}`, useTor ? {
      httpAgent: agent,
    } : {});

    return req.data;
  }
  catch (e) {
    return 'error';
  }
}

export async function sendMessage(
  e: any, 
  hub: string, 
  channel: string, 
  text: string,
  comment: string, 
  liveTime: number,
  useTor: boolean,
) {
  try {
    const req = await axios.post(hub + '/ems/message', {
      text,
      channel,
      comment,
      "live_time": liveTime,
    }, useTor ? {
      httpAgent: agent,
    }: {});

    return req.status === 200;
  }
  catch (e) {
    console.log(e)
    return false;
  }
}