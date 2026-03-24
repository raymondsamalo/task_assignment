import Logo from "./assets/logo.svg";
import "./Main.css";
import {Skill} from 'wasp/client/crud'
export function MainPage() {
  const { data: skills, isLoading, error } = Skill.getAll.useQuery()

  return (
    <main className="container">
      <img className="logo" src={Logo} alt="wasp" />

      <h2 className="title">Welcome to Wasp!</h2>

      <p className="content">
        This is page <code>MainPage</code> located at route <code>/</code>.
        <br />
        Open <code>src/MainPage.tsx</code> to edit it.
      </p>
      <ul>
        {skills?.map((skill)=>(
          <li key={skill.id}>{skill.name}</li>
        ))}
      </ul>
      <div className="buttons">
        <a
          className="button button-filled"
          href="https://wasp.sh/docs/tutorial/create"
          target="_blank"
          rel="noreferrer noopener"
        >
          Take the Tutorial
        </a>
        <a
          className="button button-outlined"
          href="https://discord.com/invite/rzdnErX"
          target="_blank"
          rel="noreferrer noopener"
        >
          Chat on Discord
        </a>
      </div>
    </main>
  );
}
