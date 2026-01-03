// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN' // Import tiếng Việt
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#003eb3', // Màu xanh đậm học thuật
          borderRadius: 6,         // Bo góc nhẹ
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          colorBgLayout: '#f0f2f5', // Màu nền xám nhạt cho toàn web
        },
        components: {
          Layout: {
            headerBg: '#ffffff', // Header màu trắng cho sạch
          },
          Menu: {
            darkItemBg: '#001529', // Menu bên trái màu tối chuyên nghiệp
          }
        }
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)