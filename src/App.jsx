import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import store from './store';
import RutasConfig from './components/config/RutasConfig';

function App() {
  return (
    <>
      <Provider store={store}>
        <RutasConfig />
      </Provider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
