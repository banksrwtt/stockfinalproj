import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { LineChartOutlined, DatabaseOutlined, SettingOutlined, BellOutlined, BarChartOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;

const Navbar = () => {
  return (

    <Menu mode="horizontal" >
      <Menu.Item key="Home" icon={<DatabaseOutlined />} >
        <Link to='/'>Home</Link>
      </Menu.Item>

      <Menu.Item key="Chart" icon={<BarChartOutlined />} >
        <Link to='/chart'>Chart</Link>
      </Menu.Item>

      <Menu.Item key="Notification" icon={<BellOutlined />} >
        <Link to='/notification'>Notification</Link>
      </Menu.Item>

      <Menu.Item key="Indicator" icon={<LineChartOutlined />} >
        <Link to='/indicator'>Indicator</Link>
      </Menu.Item>


      <SubMenu
        key="SubMenu"
        icon={<SettingOutlined />}
        title="Account"
        style={{ position: 'absolute', right: '0' }}
      >
        <Menu.ItemGroup>

          <Menu.Item key="setting:1">
            <Link to='/signup' >Login/Logout</Link>
          </Menu.Item>

          <Menu.Item key='setting:2'>
            <Link to='/seemynoti' >See my Notification</Link>
          </Menu.Item>

          <Menu.Item key="setting:3">
            <Link to='/register' >Register</Link>
          </Menu.Item>
          
        </Menu.ItemGroup>
      </SubMenu>
    </Menu>

  );
}

export default Navbar