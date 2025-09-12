
export const ConfigItem = ({
  title,
  type,
  cel = false,
  required = false,
  children,
}) => {
  const id = title.replace(/\.|\s|\*/g, "_");
  return (
    <li className="space-y-2 p-4 px-2 pb-3 list-none">
      <h4
        className="m-0 flex gap-2 self-baseline p-0 text-sm font-normal leading-none"
        id={id}
      >
        <span className="font-mono font-semibold text-strong">{title}</span>
        <span className="self-base flex gap-1.5 self-baseline text-xs text-muted">
          <span>{type}</span>
          {required && (
            <span className="font-semibold text-amber-600">Required</span>
          )}
        </span>
      </h4>
      <div className="space-y-2 text-sm [&_p]:mb-0">{children}</div>
    </li>
  );
};

export const ConfigChildren = ({
  open = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div className="mx-2">
      <button
        type="button"
        appearance="outlined"
        priority="neutral"
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen && "Show Child Properties"}
        {isOpen && "Hide Child Properties"}
      </button>
      {isOpen && (
        <ul className="m-0 mt-2 flex flex-shrink-0 list-none flex-col divide-y divide-gray-200 self-start rounded-md border border-gray-200 p-0 dark:divide-gray-800 dark:border-gray-800 [&_li]:p-4">
          {children}
        </ul>
      )}
    </div>
  );
};

export const ConfigEnum = ({ label, children }) => {
  return (
    <ul className="m-0 flex flex-shrink-0 list-none flex-col divide-y divide-gray-200 self-start rounded-md border border-gray-200 p-0 dark:divide-gray-800 dark:border-gray-800 [&_li+li]:mt-0 [&_li]:py-2 list-none">
      <li className="px-4 font-semibold list-none">
        {label ? label : "Possible enum values"}
      </li>
      {children}
    </ul>
  );
};

export const ConfigEnumOption = ({ children }) => {
  return <li className="space-y-2 px-4 list-none">{children}</li>;
};

export const Config = ({ children }) => {
  return (
    <ul className="m-0 flex flex-shrink-0 list-none flex-col divide-y divide-gray-200 self-start rounded-md border border-gray-200 p-0 dark:divide-gray-800 dark:border-gray-800 list-none">
      {children}
    </ul>
  );
};
