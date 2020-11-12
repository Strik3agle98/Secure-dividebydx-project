import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const [userCred, setUserCred] = useState({
    username: "",
    password: "",
  });

  const [captcha, setCaptcha] = useState("");

  const onChange = (field) => (e) => {
    e.target
      ? setUserCred({
          ...userCred,
          [field]: e.target.value,
        })
      : setCaptcha(e);
  };

  const handleSubmit = () => {
    if (userCred.username.length === 0 || userCred.password.length === 0) {
      alert("Form can't be empty");
      return;
    }
    if (captcha.length === 0) {
      alert("captcha not done");
      return;
    }

    console.log("success!");
  };

  useEffect(() => {
    console.log(userCred);
    console.log(captcha);
  });

  return (
    <Row id="login-page" className="h-full">
      <Col span={12} className="h-full flex flex-row items-center">
        <div className="mx-16">
          <h1 id="logo" className="text-5xl mb-16">
            POSTBOOK
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
            <br />
            <br />
            Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Eget
            nunc scelerisque viverra mauris in aliquam sem fringilla ut. Cursus
            risus at ultrices mi tempus imperdiet nulla malesuada. Fermentum
            odio eu feugiat pretium nibh ipsum consequat nisl. Cursus risus at
            ultrices mi tempus imperdiet. Turpis egestas integer eget aliquet
            nibh praesent tristique magna. Mattis rhoncus urna neque viverra
            justo nec. Sed enim ut sem viverra aliquet eget sit. Nullam eget
            felis eget nunc lobortis. In iaculis nunc sed augue lacus viverra
            vitae congue eu.
            <br />
            <br />
            Eget sit amet tellus cras adipiscing enim. Vel facilisis volutpat
            est velit egestas dui id ornare arcu. Porta nibh venenatis cras sed
            felis eget velit aliquet sagittis. Nec dui nunc mattis enim ut
            tellus elementum sagittis vitae. Sed lectus vestibulum mattis
            ullamcorper velit sed ullamcorper morbi. Sed euismod nisi porta
            lorem mollis aliquam ut porttitor leo. Facilisi etiam dignissim diam
            quis. Est ullamcorper eget nulla facilisi. Viverra accumsan in nisl
            nisi. Elit scelerisque mauris pellentesque pulvinar.
            <br />
            <br />
            <br />© 2020 omne ius per Bankbiz disposito
          </p>
        </div>
      </Col>
      <Col span={12} className="h-full flex flex-row items-center">
        <div className="postbook-frame w-4/6 px-16 pb-12 ml-auto mr-40">
          <h2
            className="text-xl px-2 mb-12"
            style={{
              position: "relative",
              top: "-16px",
              left: "-8px",
              background: "#141414",
              width: "fit-content",
            }}
          >
            ET IN KEY SIGNUM
          </h2>

          {/* TO DO Sign in handler */}
          <Input
            size="large"
            placeholder="Enter your username"
            prefix={<UserOutlined />}
            className="mb-12"
            onChange={onChange("username")}
          />
          <Input
            size="large"
            placeholder="Enter your password"
            prefix={<LockOutlined />}
            className="mb-3"
            onChange={onChange("password")}
          />
          <ReCAPTCHA
            sitekey="6LcqAeIZAAAAAIcklWRbpT0gp6SqWdE_6y7shLxp"
            onChange={onChange("captcha")}
          />
          <div
            className="flex mb-16"
            style={{ color: "rgb(255 255 255 / 40%)" }}
          >
            <p className="mr-auto">Do you forget a password?</p>
            <p>Nothing to do here</p>
          </div>
          <Button size="large" htmlType="submit" onClick={handleSubmit}>
            SIGN IN
          </Button>
        </div>
      </Col>
    </Row>
  );
}
