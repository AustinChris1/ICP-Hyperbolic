import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Text "mo:base/Text";
import Char "mo:base/Char";
import Nat "mo:base/Nat";
import Types "Types";

actor {
  // API key
  let API_KEY = "your_api_key_here";
  // Transform function for modifying HTTP response
  public query func transform(raw : Types.TransformArgs) : async Types.CanisterHttpResponsePayload {
    let transformed : Types.CanisterHttpResponsePayload = {
      status = raw.response.status;
      body = raw.response.body;
      headers = [
        { name = "Content-Security-Policy"; value = "default-src 'self'" },
        { name = "Strict-Transport-Security"; value = "max-age=63072000" },
        { name = "X-Content-Type-Options"; value = "nosniff" },
      ];
    };
    transformed;
  };

  // Parsing function to extract the value of a given key (e.g., "content") from the JSON string
  private func parse(t : Text, k : Text) : Text {
    for (e : Text in Text.split(t, #char '{')) {
      if (Text.contains(e, #text k)) {
        if (Text.contains(e, #char '{')) {
          return parse(e, k);
        } else {
          for (i : Text in Text.split(e, #char ',')) {
            if (Text.contains(i, #text k)) {
              for (s : Text in Text.split(i, #char ':')) {
                if (Text.contains(s, #text k) == false) {
                  var r : Text = Text.replace(s, #char '\"', "");
                  r := Text.replace(r, #char ']', "");
                  r := Text.replace(r, #char '}', "");
                  return r;
                };
              };
            };
          };
        };
      };
    };
    return "Not found";
  };

  // Main function for generating text
  public func generate_text(prompt : Text, promptModel : Text) : async Text {
    // API details
    let host : Text = "api.hyperbolic.xyz";
    let url = "https://api.hyperbolic.xyz/v1/chat/completions";

    // Request headers
    let request_headers = [
      { name = "Host"; value = host },
      { name = "User-Agent"; value = "motoko_post_sample" },
      { name = "Content-Type"; value = "application/json" },
      {
        name = "Authorization";
        value = "Bearer " # API_KEY;
      },
    ];

    // Construct JSON body for the POST request
    let request_body_json : Text = Text.concat(
      Text.concat(
        "{ \"messages\": [{\"role\": \"user\", \"content\": \"",
        prompt,
      ),
      Text.concat(
        "\"}], \"model\": \"",
        Text.concat(promptModel, "\" }"),
      ),
    );

    let request_body_as_Blob : Blob = Text.encodeUtf8(request_body_json);
    let request_body_as_nat8 : [Nat8] = Blob.toArray(request_body_as_Blob);

    // Transform context
    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    // Setting up the HTTP request
    let http_request : Types.HttpRequestArgs = {
      url = url;
      max_response_bytes = ?2_000_000;
      headers = request_headers;
      body = ?request_body_as_nat8;
      method = #post;
      transform = ?transform_context;
    };

    // Add cycles for processing
    Cycles.add(500_000_000_000);

    // Send the HTTP request
    let ic : Types.IC = actor ("aaaaa-aa");
    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    // Process response
    let result : Text = switch (http_response.status) {
      case (200) {
        let response_body : Blob = Blob.fromArray(http_response.body);
        let decoded_text : Text = switch (Text.decodeUtf8(response_body)) {
          case (null) { "No value returned" };
          case (?y) { y };
        };

        // Extract the message content from the JSON result
        var content : Text = parse(decoded_text, "content");
        content;
      };
      case (400) { "Error: Bad Request (400). Check input format." };
      case (401) { "Error: Unauthorized (401). Invalid API key." };
      case (404) { "Error: Not Found (404)." };
      case _ { "Error: Unexpected response." };
    };
    result;
  };


  // Function to generate audio from text
  public func generate_audio(text : Text) : async Text {
    if (Text.size(text) == 0) {
      return "Error: Text is required.";
    };

    // API details
    let host : Text = "api.hyperbolic.xyz";
    let url = "https://api.hyperbolic.xyz/v1/audio/generation";

    // Request headers
    let request_headers = [
      { name = "Host"; value = host },
      { name = "User-Agent"; value = "motoko_audio_sample" },
      { name = "Content-Type"; value = "application/json" },
      {
        name = "Authorization";
        value = "Bearer " # API_KEY;
      },
    ];

    // Construct JSON body for the POST request
    let request_body_json : Text = Text.concat("{ \"text\": \"", Text.concat(text, "\" }"));
    let request_body_as_Blob : Blob = Text.encodeUtf8(request_body_json);
    let request_body_as_nat8 : [Nat8] = Blob.toArray(request_body_as_Blob);

    // Transform context
    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    // Setting up the HTTP request
    let http_request : Types.HttpRequestArgs = {
      url = url;
      max_response_bytes = ?500_000; // Allow for larger responses
      headers = request_headers;
      body = ?request_body_as_nat8;
      method = #post;
      transform = ?transform_context;
    };

    // Add cycles for processing
    Cycles.add(500_000_000_000);

    // Send the HTTP request
    let ic : Types.IC = actor ("aaaaa-aa");
    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    // Process response
    let result : Text = switch (http_response.status) {
      case (200) {
        let response_body : Blob = Blob.fromArray(http_response.body);
        let decoded_text : Text = switch (Text.decodeUtf8(response_body)) {
          case (null) { "Error: No audio data returned." };
          case (?y) { y }; // Assuming the response contains the base64-encoded audio
        };
        // Extract the message content from the JSON result
        var content : Text = parse(decoded_text, "audio");
        content;
      };
      case (400) { "Error: Bad Request (400). Check input text." };
      case (401) { "Error: Unauthorized (401). Invalid API key." };
      case (404) { "Error: Not Found (404)." };
      case _ { "Error: Unexpected response." };
    };
    result;
  };

  // Main function for generating image
  public func generate_image(prompt : Text, height : Nat, width : Nat, controlnet_image : ?Text, controlnet_name : ?Text, lora : ?Text) : async Text {
    // API details
    let host : Text = "api.hyperbolic.xyz";
    let url = "https://api.hyperbolic.xyz/v1/image/generation";

    // Request headers
    let request_headers = [
      { name = "Host"; value = host },
      { name = "User-Agent"; value = "motoko_post_sample" },
      { name = "Content-Type"; value = "application/json" },
      {
        name = "Authorization";
        value = "Bearer " # API_KEY;
      },
    ];

    // Default model
    var model_name : Text = "SDXL1.0-base";

    // Use ControlNet model if applicable
    switch (controlnet_image, controlnet_name) {
      case (?_, ?_) {
        model_name := "SDXL-ControlNet"; // Set model supporting ControlNet
      };
      case (_) {};
    };

    // Construct JSON body for the POST request
    var request_body_json : Text = Text.concat("{ \"model_name\": \"", model_name);
    request_body_json := Text.concat(request_body_json, "\", \"prompt\": \"");
    request_body_json := Text.concat(request_body_json, prompt);
    request_body_json := Text.concat(request_body_json, "\", \"height\": ");
    request_body_json := Text.concat(request_body_json, Nat.toText(height));
    request_body_json := Text.concat(request_body_json, ", \"width\": ");
    request_body_json := Text.concat(request_body_json, Nat.toText(width));
    request_body_json := Text.concat(request_body_json, ", \"backend\": \"auto\"");

    // Handle ControlNet-specific request
    let max_image_size : Nat = 50_000_000; // 50 MB

    // Check the size of the base64 image
    switch (controlnet_image, controlnet_name) {
      case (?base64Image, ?name) {
        try {
          let image_size : Nat = Text.size(base64Image);
          if (image_size > max_image_size) {
            return "Error: Image size exceeds limit.";
          };
          request_body_json := Text.concat(request_body_json, ", \"controlnet_image\": \"");
          request_body_json := Text.concat(request_body_json, base64Image);
          request_body_json := Text.concat(request_body_json, "\", \"controlnet_name\": \"");
          request_body_json := Text.concat(request_body_json, name);
          request_body_json := Text.concat(request_body_json, "\", \"cfg_scale\": 20");
          request_body_json := Text.concat(request_body_json, ", \"seed\": 5742320");
        } catch (_) {
          return "Error processing ControlNet image: ";
        };
      };
      case (_) {};
    };

    // Handle LoRA-specific request
    switch (lora) {
      case (?lora_value) {
        request_body_json := Text.concat(request_body_json, ", \"lora\": \"");
        request_body_json := Text.concat(request_body_json, lora_value);
        request_body_json := Text.concat(request_body_json, "\"");
      };
      case (_) {};
    };

    request_body_json := Text.concat(request_body_json, " }");

    let request_body_as_Blob : Blob = Text.encodeUtf8(request_body_json);
    let request_body_as_nat8 : [Nat8] = Blob.toArray(request_body_as_Blob);

    // Setting up the HTTP request
    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]); // Empty context for now
    };

    let http_request : Types.HttpRequestArgs = {
      url = url;
      max_response_bytes = ?2_000_000;
      headers = request_headers;
      body = ?request_body_as_nat8;
      method = #post;
      transform = ?transform_context;
    };

    // Add cycles for processing
    Cycles.add(900_000_000_000);

    // Send the HTTP request
    let ic : Types.IC = actor ("aaaaa-aa");
    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    // Process response
    let result : Text = switch (http_response.status) {
      case (200) {
        let response_body : Blob = Blob.fromArray(http_response.body);
        let decoded_text : Text = switch (Text.decodeUtf8(response_body)) {
          case (null) { "No value returned" };
          case (?y) { y };
        };

        // Extract the image base64 from the response
        var base64_image : Text = parse(decoded_text, "image");
        base64_image;
      };
      case (400) { "Error: Bad Request (400). Check input format." };
      case (401) { "Error: Unauthorized (401). Invalid API key." };
      case (404) { "Error: Not Found (404)." };
      case _ { "Error: Unexpected response." };
    };
    result;
  };

};
