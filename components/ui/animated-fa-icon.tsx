import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type AnimatedFaIconProps = {
  icon: IconDefinition;
  className?: string;
  animation?: "float" | "pulse" | "orbit" | "shimmer";
};

export function AnimatedFaIcon({
  icon,
  className = "",
  animation = "float",
}: AnimatedFaIconProps) {
  return (
    <span className={`fa-icon-shell fa-icon-${animation} ${className}`.trim()}>
      <FontAwesomeIcon icon={icon} aria-hidden="true" />
    </span>
  );
}
