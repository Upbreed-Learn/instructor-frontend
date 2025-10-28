import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const AvatarCustom = (props: {
  src: string | any;
  alt: string;
  fallback: string;
  className?: string;
}) => {
  return (
    <Avatar className={cn(props.className)}>
      <AvatarImage
        src={props.src}
        alt={props.alt}
        className="object-cover object-top"
      />
      <AvatarFallback>{props.fallback}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarCustom;
