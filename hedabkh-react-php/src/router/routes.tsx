import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import { withRouteParams } from './RouteAdapter';

// Public Pages (HomePage loaded directly, all other pages code-split with React.lazy)
import HomePage from '../app/[locale]/page';
const AboutPage = React.lazy(() => import('../app/[locale]/about/page'));
const ServicesPage = React.lazy(() => import('../app/[locale]/services/page'));
const ServicesExplorerPage = React.lazy(() => import('../app/[locale]/services-explorer/page'));
const ServiceDetailPage = React.lazy(() => import('../app/[locale]/services/[id]/page'));
const ProjectsPage = React.lazy(() => import('../app/[locale]/projects/page'));
const ProjectDetailsPage = React.lazy(() => import('../app/[locale]/projects/[id]/page'));
const EquipmentPage = React.lazy(() => import('../app/[locale]/equipment/page'));
const CertificatesPage = React.lazy(() => import('../app/[locale]/certificates/page'));
const TeamPage = React.lazy(() => import('../app/[locale]/team/page'));
const NewsPage = React.lazy(() => import('../app/[locale]/news/page'));
const ArticleSinglePage = React.lazy(() => import('../app/[locale]/news/[slug]/page'));
const ChairmanMessagePage = React.lazy(() => import('../app/[locale]/chairman-message/page'));
const ContactPage = React.lazy(() => import('../app/[locale]/contact/page'));
const NotFoundPage = React.lazy(() => import('../app/[locale]/not-found'));

const AdminLoginPage = React.lazy(() => import('../app/[locale]/admin/login/page'));
const AdminOverviewPage = React.lazy(() => import('../app/[locale]/admin/page'));
const ProjectsAdminPage = React.lazy(() => import('../app/[locale]/admin/projects/page'));
const ArticlesAdminPage = React.lazy(() => import('../app/[locale]/admin/articles/page'));
const ServicesAdminPage = React.lazy(() => import('../app/[locale]/admin/services/page'));
const CertificatesAdminPage = React.lazy(() => import('../app/[locale]/admin/certificates/page'));
const EquipmentAdminPage = React.lazy(() => import('../app/[locale]/admin/equipment/page'));
const PartnersCMSPage = React.lazy(() => import('../app/[locale]/admin/partners/page'));
const TeamAdminPage = React.lazy(() => import('../app/[locale]/admin/team/page'));
const StatisticsAdminPage = React.lazy(() => import('../app/[locale]/admin/statistics/page'));
const InquiriesAdminPage = React.lazy(() => import('../app/[locale]/admin/inquiries/page'));
const SettingsAdminPage = React.lazy(() => import('../app/[locale]/admin/settings/page'));
const AdminUsersPage = React.lazy(() => import('../app/[locale]/admin/users/page'));
const MediaAdminPage = React.lazy(() => import('../app/[locale]/admin/media/page'));
const DesignHubPage = React.lazy(() => import('../app/[locale]/admin/design/page'));
const VisualBuilderIndexPage = React.lazy(() => import('../app/[locale]/admin/visual-builder/page'));
const VisualBuilderDynamicPage = React.lazy(() => import('../app/[locale]/admin/visual-builder/[pageId]/page'));
const LivePreviewPage = React.lazy(() => import('../app/[locale]/admin/preview/[type]/[id]/page'));

// Wrapped components with RouteAdapter
const WrappedHome = withRouteParams(HomePage);
const WrappedAbout = withRouteParams(AboutPage);
const WrappedServices = withRouteParams(ServicesPage);
const WrappedServicesExplorer = withRouteParams(ServicesExplorerPage);
const WrappedServiceDetails = withRouteParams(ServiceDetailPage);
const WrappedProjects = withRouteParams(ProjectsPage);
const WrappedProjectDetails = withRouteParams(ProjectDetailsPage);
const WrappedEquipment = withRouteParams(EquipmentPage);
const WrappedCertificates = withRouteParams(CertificatesPage);
const WrappedTeam = withRouteParams(TeamPage);
const WrappedNews = withRouteParams(NewsPage);
const WrappedArticle = withRouteParams(ArticleSinglePage);
const WrappedChairman = withRouteParams(ChairmanMessagePage);
const WrappedContact = withRouteParams(ContactPage);

const WrappedAdminLogin = withRouteParams(AdminLoginPage);
const WrappedAdminOverview = withRouteParams(AdminOverviewPage);
const WrappedProjectsAdmin = withRouteParams(ProjectsAdminPage);
const WrappedArticlesAdmin = withRouteParams(ArticlesAdminPage);
const WrappedServicesAdmin = withRouteParams(ServicesAdminPage);
const WrappedCertificatesAdmin = withRouteParams(CertificatesAdminPage);
const WrappedEquipmentAdmin = withRouteParams(EquipmentAdminPage);
const WrappedPartnersAdmin = withRouteParams(PartnersCMSPage);
const WrappedTeamAdmin = withRouteParams(TeamAdminPage);
const WrappedStatisticsAdmin = withRouteParams(StatisticsAdminPage);
const WrappedInquiriesAdmin = withRouteParams(InquiriesAdminPage);
const WrappedSettingsAdmin = withRouteParams(SettingsAdminPage);
const WrappedUsersAdmin = withRouteParams(AdminUsersPage);
const WrappedMediaAdmin = withRouteParams(MediaAdminPage);
const WrappedDesignAdmin = withRouteParams(DesignHubPage);
const WrappedVisualBuilderIndex = withRouteParams(VisualBuilderIndexPage);
const WrappedVisualBuilderEditor = withRouteParams(VisualBuilderDynamicPage);
const WrappedLivePreview = withRouteParams(LivePreviewPage);

export const routes: RouteObject[] = [
  // Root Redirect
  {
    path: '/',
    element: <Navigate to="/ar" replace />,
  },
  {
    path: '/admin',
    element: <Navigate to="/ar/admin" replace />,
  },
  {
    path: '/admin/login',
    element: <Navigate to="/ar/admin/login" replace />,
  },

  // Admin Routes (Isolated layout & login route)
  {
    path: '/:locale/admin/login',
    element: <WrappedAdminLogin />,
  },
  {
    path: '/:locale/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <WrappedAdminOverview /> },
      { path: 'projects', element: <WrappedProjectsAdmin /> },
      { path: 'articles', element: <WrappedArticlesAdmin /> },
      { path: 'news', element: <WrappedArticlesAdmin /> },
      { path: 'services', element: <WrappedServicesAdmin /> },
      { path: 'certificates', element: <WrappedCertificatesAdmin /> },
      { path: 'equipment', element: <WrappedEquipmentAdmin /> },
      { path: 'partners', element: <WrappedPartnersAdmin /> },
      { path: 'team', element: <WrappedTeamAdmin /> },
      { path: 'statistics', element: <WrappedStatisticsAdmin /> },
      { path: 'inquiries', element: <WrappedInquiriesAdmin /> },
      { path: 'settings', element: <WrappedSettingsAdmin /> },
      { path: 'users', element: <WrappedUsersAdmin /> },
      { path: 'media', element: <WrappedMediaAdmin /> },
      { path: 'design', element: <WrappedDesignAdmin /> },
      { path: 'visual-builder', element: <WrappedVisualBuilderIndex /> },
      { path: 'visual-builder/:pageId', element: <WrappedVisualBuilderEditor /> },
      { path: 'preview/:type/:id', element: <WrappedLivePreview /> },
    ],
  },

  // Public Routes (Wrapped in PublicLayout)
  {
    path: '/:locale',
    element: <PublicLayout />,
    children: [
      { index: true, element: <WrappedHome /> },
      { path: 'about', element: <WrappedAbout /> },
      { path: 'services', element: <WrappedServices /> },
      { path: 'services-explorer', element: <WrappedServicesExplorer /> },
      { path: 'services/:id', element: <WrappedServiceDetails /> },
      { path: 'projects', element: <WrappedProjects /> },
      { path: 'projects/:id', element: <WrappedProjectDetails /> },
      { path: 'equipment', element: <WrappedEquipment /> },
      { path: 'certificates', element: <WrappedCertificates /> },
      { path: 'team', element: <WrappedTeam /> },
      { path: 'news', element: <WrappedNews /> },
      { path: 'news/:slug', element: <WrappedArticle /> },
      { path: 'chairman-message', element: <WrappedChairman /> },
      { path: 'contact', element: <WrappedContact /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Catch-all 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
