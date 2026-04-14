import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";
import { Toaster } from "sonner";

import { Provider } from "react-redux";
import store from "@/store/store";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <Toaster position="top-right" richColors />
            <App />
        </Provider>
    </React.StrictMode>
);
