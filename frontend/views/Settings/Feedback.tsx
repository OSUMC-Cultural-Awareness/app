import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { List, TextInput, Text, Button } from "react-native-paper";

import { Feedback as FeedbackSender } from "../../lib";

const Styles = StyleSheet.create({
  leftIcon: {
    left: -5,
  },

  input: {
    padding: 20,
  },

  characterCounter: {
    fontSize: 11,
    right: 22,
    position: "absolute",
    bottom: 20,
    paddingRight: 2,
    paddingBottom: 2,
  },

  button: {
    padding: 15,
    margin: 10,
  },
});

const characterLimit = 300;

type state = "sending" | "sent" | "failed" | "writing";

export default function Feedback(): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [state, setState] = useState<state>("writing");

  const handleInput = (text: string) => {
    if (text.length > characterLimit) {
      return;
    }

    setFeedback(text);
  };

  const sendFeedback = async () => {
    if (feedback === "") {
      return;
    }

    setState("sending");
    try {
      await FeedbackSender.send(feedback);
    } catch (err) {
      setState("failed");
      return;
    }

    setState("sent");
  };

  const reset = () => {
    setState("writing");
    setFeedback("");
  };

  return (
    <View>
      <List.Accordion
        left={(props) => (
          <List.Icon
            {...props}
            style={Styles.leftIcon}
            icon="message-reply-text"
          />
        )}
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
        title="Feedback"
      >
        {state === "sent" && (
          <Button
            icon="check"
            color="green"
            mode="contained"
            style={Styles.button}
            onPress={reset}
          >
            Thank you
          </Button>
        )}
        {state === "failed" && (
          <Button
            icon="alert"
            color="yellow"
            mode="contained"
            style={Styles.button}
            onPress={() => setState("writing")}
          >
            Try again later
          </Button>
        )}
        {(state === "writing" || state === "sending") && (
          <TextInput
            style={Styles.input}
            mode="outlined"
            multiline={true}
            label="Where can we improve?"
            value={feedback}
            onChangeText={handleInput}
            numberOfLines={4}
            right={
              state === "writing" ? (
                <TextInput.Icon name="send" onPress={() => sendFeedback()} />
              ) : (
                <TextInput.Icon name="check" />
              )
            }
          />
        )}
        {(state === "writing" || state === "sending") && (
          <Text
            style={Styles.characterCounter}
          >{`${feedback.length}/${characterLimit}`}</Text>
        )}
      </List.Accordion>
    </View>
  );
}
