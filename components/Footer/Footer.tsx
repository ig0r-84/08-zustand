import css from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© 2026 NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: your name</p>
          <p>
            Contact:{" "}
            <a href="mailto:support@notehub.com">support@notehub.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
