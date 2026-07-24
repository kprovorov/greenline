import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Greenline</h1>
      <p>Fully automated smart garden</p>
      <p>Wtf smart garden, dude?</p>
      <p>
        Each plant lives in its own box and pot and monitored by a number of
        sensors: soil and air humidity, temperature, light and have automatic
        irrigation system.
      </p>
      <p>
        But the most interesting part is that each plant has it&rsquo;s own
        surveillance camera and AI monitors condition of a plant every day.
      </p>
      <p>
        You can also see each of our plant camera and sensor data online:{" "}
        <Link href="/dashboard">click here</Link>
      </p>
      <p>Each plant is available to purchase</p>
    </main>
  );
}
