import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "antd/dist/antd.min.css"; // 导入antd的样式文件
import  "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);