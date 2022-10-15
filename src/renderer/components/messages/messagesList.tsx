import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Actions from "renderer/actions";
import { AppStore, StoreState } from "renderer/store";
import Loader from "../loader";

interface MessagesListProps {
  reqData: {
    limit: number,
    offset: number
  },
  setReqData: (data: {
    limit: number,
    offset: number
  }) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  reqData,
  setReqData
}) => {
  const { channel, hub, messages, selectedMessage, useTor } = useSelector((state: StoreState) => ({
    channel: state.app.selectedChannel,
    hub: state.app.hub,
    messages: state.app.messages,
    selectedMessage: state.app.selectedMessage,
    useTor: state.app.useTor
  }));
  const [loading, setLoading] = useState(false);
  const [fullCount, setFullCount] = useState(0);

  useEffect(() => {
    load(!reqData.offset)
  }, [channel, reqData])

  const load = async (withReset: boolean) => {
    if (channel) {
      setLoading(true)
      const res = await Actions.loadMessages({
        channel: channel || '',
        hub,
        withReset,
        useTor,
        ...reqData
      })

      if (res === 'error') {
        Actions.sendNotify({
          message: 'Failed to load messages',
          type: 'error'
        })
      }
      else setFullCount(res)
      setLoading(false)
    }
  }

  const getDiffrence = (start: string, end: string) => {
    const startM = moment(start);
    const endM = moment(end);

    const duration = moment.duration(endM.diff(startM))

    
    const days = duration.asDays();
    const hours = duration.asHours();
    const minutes = duration.asMinutes();
    const seconds = duration.asSeconds();
    

    return days < 1 ? hours < 1 ? minutes < 1 ? Math.floor(seconds) + ' seconds' : Math.floor(minutes) + ' minutes' : Math.floor(hours) + ' hours' : Math.floor(days) + ' days';
  }

  return (
    <div style={{ 
      width: '300px', 
      minWidth: '300px', 
      overflowY: 'auto', 
      height: 'calc(100vh - 38px)',
      backgroundColor: '#0c0c0e',
    }}>
      {loading && <Loader />}
      {!messages.length && (
        <div className="no-messages-block">
          No messages here :(
        </div>
      )}
      {messages.map((m, i) => (
        <div 
          key={`message-${i}`} 
          className={`message-list-item ${m.message_id === selectedMessage ? 'selected' : ''}`}
          onClick={() => AppStore.update({selectedMessage: m.message_id})}>
          <div className="message-list-item-comment">
            {m.comment || 'No comment'}<br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: '#777E98' }}>
                {moment(m.dt_create).format('MMMM D, HH:mm:ss')}
              </span>

              <span style={{ fontSize: '10px', color: 'rgba(233, 55, 55, .8)' }}>
                Delete in {getDiffrence(m.dt_create, m.good_till)}
              </span>
            </div>
          </div>
        </div>
      ))}
      {fullCount > messages.length && (
          <button style={{ 
            width: '100%',
          }}
          onClick={() => {
            setReqData({
              limit: reqData.limit,
              offset: reqData.offset + 10
            })
          }}>Load more</button>
      )}
    </div>
  )
};

export default MessagesList;
