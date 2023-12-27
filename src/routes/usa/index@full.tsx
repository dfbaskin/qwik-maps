import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { states } from "./states";
import styles from "./states-list.css?inline";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
  useStylesScoped$(styles);
  const nav = useNavigate();
  return (
    <div class="states-list">
      <h1>USA State Capitols</h1>
      <table>
        <thead>
          <tr>
            <th>Postal Code</th>
            <th>State</th>
            <th>Capitol</th>
          </tr>
        </thead>
        <tbody>
          {states.map(([stateCode, stateName, capitolName]) => {
            return (
              <tr key={stateCode} onClick$={() => nav(`/usa/${stateCode.toLowerCase()}`, { type: "link" })}>
                <td>{stateCode}</td>
                <td>{stateName}</td>
                <td>{capitolName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
