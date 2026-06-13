import markUrl from "../../assets/brand/mnemoscope-mark.svg";

type LogoProps = {
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className={`brand-lockup${compact ? " brand-lockup--compact" : ""}`}>
      <img src={markUrl} alt="" className="brand-mark" />
      {!compact && (
        <div>
          <strong>MnemoScope</strong>
          <span>Private memory archive</span>
        </div>
      )}
    </div>
  );
}

