import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import  {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"


const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Chagpt",
      sender: "ChatGPT",
    
    }
  ]) //[]

  const handleSend = async (message) =>{
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages ,newMessage] ; //all the old messages, + the new message
      
  
     
    //Update our message states
    newMessages(newMessages);

    // set a typing indicator(chatgpt for example chagpt is typing )
     setTyping(true);
    //process message to chagpt (send it over and see the response)
     await processMessageToChatGPT(newMessages)
  }

  async function processMessageToChatGPT(chatMessages){
    // chatMessages { sender: "user" or "ChatGPT", message: "the message content here"}
    // apiMessages { role: "user" or assistant, content: "The message content here"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role="assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message  }
    })
     

    // role: "user" -> a message from the user, "assistant" -> a response from chatGPT
    //"system" -> generally one initial message defining How we want chagpt to talk
    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old ."// Speak a pirate, Explain like I am a 10 years
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages  // [message1,message2,message3]
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer" + API_KEY,
        "content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then ((data) => {
      return data.json();
    }).then ((data) => {
      console.log(data);
      console.log (data.choices[0].message.content);
      setMessages (
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT"
        }]
      );
      setTyping(false);
    })
  }



  return (
 
      <div className='App'>
        <div style={{ position: "relative", height: "800px", width: "700px"}}>
            <MainContainer>
               <ChatContainer>
                   <MessageList
                     typingIndicator={ typing ? <TypingIndicator content="ChatGPT is typing"/> : null}
                   >
                      {messages.map((message,i) =>{
                          return <Message key={i} model={message}/>
                      })}
                   </MessageList>
                   <MessageInput placeholder='Type message here' onSend={handleSend}/>
               </ChatContainer>
            </MainContainer>
        </div>
      </div>   
  )
}

export default App
