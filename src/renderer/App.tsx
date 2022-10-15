import { Provider as ReduxProvider } from "react-redux";
import store from "./store";
import "./App.css";
import Root from "./components/_root";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <Root />
    </ReduxProvider>
  );
}
