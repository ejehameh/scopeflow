interface LogoProps {
  /** When provided, shows "ScopeFlow / {projectName}" */
  projectName?: string;
}

export function Logo({ projectName }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-lg text-2xl font-bold bg-primary/10 text-primary">
        S
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">ScopeFlow</span>
        {projectName ? (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{projectName}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
