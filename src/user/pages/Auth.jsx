import React, { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/components/UIElements/utils/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hooks";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
const Auth = () => {
  const { Login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const loginHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: undefined,
            isValid: false,
          },
          image: {
            value: undefined,
            isValid: false,
          },
        },
        formState.inputs.email.value && formState.inputs.password.value
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogin((prevState) => !prevState);
  };
  const authHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        Login(responseData.userId, responseData.token);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        console.log(formData);
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          formData
        );
        Login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Requirement</h2>
        <hr />
        <form onSubmit={authHandler}>
          {!isLogin && (
            <Input
              element="input"
              id="name"
              type="name"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="pls enter a valid name"
              onInput={inputHandler}
            />
          )}
          {!isLogin && <ImageUpload id="image" center onInput={inputHandler} />}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="you should enter the valid email"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="the password shloud be at least 5 char "
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogin ? "LOGIN" : "SIGN UP"}
          </Button>
          <br />
          <Button type="button" onClick={loginHandler}>
            SWICH TO {isLogin ? "SIGN UP" : "LOGIN"}
          </Button>
        </form>
      </Card>
    </>
  );
};

export default Auth;
