import './App.css';
import Chat from './component/chat';
import ChatWidget from './component/ChatWidget';
import { ChakraProvider } from '@chakra-ui/react'
function App() {
  return ( 
    <ChakraProvider theme={{}}>
        <ChatWidget  userID={"641355efd1279125243759f3"}  />
        </ChakraProvider>
  );
}

export default App;
