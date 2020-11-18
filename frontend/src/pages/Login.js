import React, { useState } from "react";
import { Row, Col, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";
import { loginAPI, registerAPI, getUserAPI } from "../api";
import { externalEndpoint } from "../const";

export default ({ setSession }) => {
  const [userCred, setUserCred] = useState({
    username: "",
    password: "",
  });

  const [register, setRegister] = useState({
    username: "",
    password: "",
    displayName: "",
    role: "user",
  });

  const [checked, setChecked] = useState(false);

  const [captcha, setCaptcha] = useState("");

  const onChange = (field) => (e) => {
    e.target
      ? setUserCred({
          ...userCred,
          [field]: e.target.value,
        })
      : setCaptcha(e);
  };

  const onChangeReg = (field) => (e) => {
    e.target
      ? setRegister({
          ...register,
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

    loginAPI(externalEndpoint)(userCred)
      .then((response) => {
        const payload = JSON.parse(atob(response.data.token.split(".")[1]));
        const { userId } = payload;
        getUserAPI(externalEndpoint)(userId)(response.data.token).then(
          (response2) => {
            setSession({
              authenticated: true,
              user: response2.data.user,
              token: response.data.token,
            });
          }
        );
      })
      .catch(() => alert("user doesn't exist!"));
  };

  const handleRegister = () => {
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/;
    if (!register.username || !register.password || !register.displayName) {
      alert("Form can't be empty");
      return;
    }
    if (captcha.length === 0) {
      alert("captcha not done");
      return;
    }
    if (!register.password.match(passw)) {
      alert(
        "password must contain capital letter, normal letter, number and longer than 8 characters."
      );
      return;
    }

    registerAPI(externalEndpoint)(register)
      .then(() => {
        alert("register success!!");
      })
      .catch(() => alert("user doesn't exist!"));
  };

  return (
    <Row id="login-page" className="h-full">
      <Col span={12} className="h-full flex flex-row items-center">
        <div className="mx-16">
          <h1 id="logo" className="text-5xl mb-16">
            POSTBOOK
          </h1>
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
              REGISTER
            </h2>

            <Input
              size="large"
              placeholder="Enter your username"
              prefix={<UserOutlined />}
              className="mb-12"
              onChange={onChangeReg("username")}
            />
            <Input.Password
              size="large"
              placeholder="Enter your password"
              prefix={<LockOutlined />}
              className="mb-12"
              onChange={onChangeReg("password")}
            />
            <Input
              size="large"
              placeholder="Enter your Display Name"
              prefix={<UserOutlined />}
              className="mb-3"
              onChange={onChangeReg("displayName")}
            />
            <Checkbox
              style={{ color: "rgb(255 255 255 / 40%)" }}
              value={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
                e.target.checked
                  ? setRegister({
                      ...register,
                      role: "admin",
                    })
                  : setRegister({
                      ...register,
                      role: "user",
                    });
              }}
            >
              Register as Admin ?
            </Checkbox>
            <ReCAPTCHA
              sitekey="6LcqAeIZAAAAAIcklWRbpT0gp6SqWdE_6y7shLxp"
              onChange={onChange("captcha")}
            />
            <br />
            <Button size="large" htmlType="submit" onClick={handleRegister}>
              REGISTER
            </Button>
          </div>
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
            SIGN IN
          </h2>

          <Input
            size="large"
            placeholder="Enter your username"
            prefix={<UserOutlined />}
            className="mb-12"
            onChange={onChange("username")}
          />
          <Input.Password
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
};
