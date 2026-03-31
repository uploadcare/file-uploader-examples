import { MyCustomActivity } from "./MyCustomActivity";
import st from "./MyCustomActivityComponent.module.css";

interface Props {
  api: InstanceType<typeof MyCustomActivity>;
}

export function MyCustomActivityComponent({ api }: Props) {
  return (
    <div className={st.content}>
      This is a custom activity component. It's rendered using React.
      <div className={st.actions}>
        <button onClick={() => api.$["*historyBack"]()}>Go back</button>
        <button
          onClick={() => {
            api.addFileFromUrl(
              "https://ucarecdn.com/7c167b79-9f27-4489-8032-3f3be1840605/"
            );
            api.$["*currentActivity"] = MyCustomActivity.activities.UPLOAD_LIST;
          }}
        >
          Add file
        </button>
      </div>
    </div>
  );
}
