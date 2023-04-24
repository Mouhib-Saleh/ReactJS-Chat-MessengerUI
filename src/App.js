import "./component/chat.css";
import ChatWidget from './component/ChatWidget';
import { ChakraProvider } from '@chakra-ui/react'
function App() {
  return ( 
    <ChakraProvider >
        <ChatWidget  userID={"641355efd1279125243759f3"}  />
        </ChakraProvider>
  );
}

export default App;
