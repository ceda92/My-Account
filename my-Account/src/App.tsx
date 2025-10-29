// App.tsx
import MyAccountNew from "./components/MyAccount/MyAccountNew";
import { ProflieFormContextProvider } from "./components/MyAccount/FormContext";


function App() {
  return (

    <ProflieFormContextProvider>
      <MyAccountNew />
     </ProflieFormContextProvider>
  );
}

export default App;
