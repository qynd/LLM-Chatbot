import Text "mo:base/Text";
import Array "mo:base/Array";

actor {

  // deklarasi actor llm secara manual
  let llm = actor("w36hm-eqaaa-aaaal-qr76a-cai") : actor {
    v0_chat : shared {
      messages : [ { role : {#user; #system_; #assistant}; content : Text } ];
      model : Text;
    } -> async Text;
  };

  public func chat(messages: [Text]) : async Text {
    let formatted = Array.map<Text, { role : {#user; #system_; #assistant}; content : Text }>(
      messages,
      func(msg) {
        { role = #user; content = msg }
      }
    );

    let req = {
      messages = formatted;
      model = "llama3.1:8b"; // Model yang stabil & cepat
    };

    let result = await llm.v0_chat(req);
    return result;
  }
}
