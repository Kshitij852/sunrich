"use client";
import React, { Component, createRef } from "react";

import Editor from "./Editor";

interface Props { }

interface State {
  content: string;
}

class PostEdit extends Component<Props, State> {
  editorRef: any = createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      content: "Test",
    };
  }

  save() {
    const contents = this.editorRef.current.editor.getContents();
    console.log("save", contents);
  }

  render() {
    return (
      <div>
        <Editor
          ref={this.editorRef}
          contents={this.state.content}
          onSave={this.save.bind(this)}
        ></Editor>

        <button onClick={() => this.save()}>
          <span>Save</span>
        </button>
      </div>
    );
  }
}

export default PostEdit;
