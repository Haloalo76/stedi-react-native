import React from 'react';
import {SafeAreaView, StyleSheet, TextInput, Button} from 'react-native';


const Login = (props) => {
  const [text, onChangeText] = React.useState(null);
  const [number, onChangeNumber] = React.useState(null);

  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="Phone Number"
        keyboardType="numeric"
        value={text}
      />
      <Button
        title="Send Code"
        onPress={() => send_code(text)}
/>
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="Key Code"
        keyboardType="numeric"
      />
      <Button
      title="Log In"
      onPress={() => Login()}
      />
    </SafeAreaView>
  ); 
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});


export default Login;


const send_code = (onChangeText) => {
  fetch('https://dev.stedi.me/twofactorlogin/'+ onChangeText, {
    method: 'POST',
      headers: {
        Accept: 'application/json',
          'Content-Type': 'application/text'
      },
  });
}


