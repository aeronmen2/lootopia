import { createFileRoute, redirect } from '@tanstack/react-router';
import { useRole } from '@/hooks/useRole';
import ArtefactForm from '@/components/artefact/artefact-form';

export const Route = createFileRoute('/dashboard/create-artifact')({
  beforeLoad: async ({ context, location }) => {
    console.log('Dashboard beforeLoad');
    if (context.auth.loading) return;
    if (!context.auth.isConnected) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
  loader: async ({ context, location }) => {
    if (!context.auth.isConnected) {
      throw redirect({ to: '/', search: { redirect: location.href } });
    }
    return { isAuthenticated: context.auth.isConnected };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const canCreateHunt = useRole('admin', 'organizer');

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Créer un Artefact</h1>
        {canCreateHunt ? (
          <ArtefactForm />
        ) : (
          <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
            <p className="text-sm">
              Vous n'avez pas les autorisations nécessaires pour créer un
              artefact.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
