import { Button } from '@/shared/ui/button/Button';
import { Loader } from '@/shared/ui/loader';

type SignButtonProps = {
  label: string;
  isLoading?: boolean;
};

export const SignButton = ({ label, isLoading = false }: SignButtonProps) => {
  return (
    <Button type='submit' disabled={isLoading} ariaLabel='sign'>
      {label}
      {isLoading && <Loader />}
    </Button>
  );
};
