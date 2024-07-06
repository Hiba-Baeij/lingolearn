import React, { Suspense } from 'react';
import { Routes, Route, Outlet, RouteProps } from 'react-router-dom';
import Loading from '@/shared/components/Loading';
import { RouteRecord } from '@/shared/types/route';

const RenderRoutes = ({ routes }: { routes: RouteRecord[] }) => {
    return routes.map((route, index) => (
        <Route key={index} path={route.path}
            element={
                route.component ?

                    <route.layout {...route.props}>
                        <Suspense fallback={<Loading />}>
                            <main>
                                {
                                    <route.component {...route.props} />
                                }
                            </main>
                        </Suspense>
                    </route.layout> :
                    <Outlet></Outlet>
            }


        >
            {route.childs ? RenderRoutes({ routes: route.childs }) : null}
        </Route>
    ))

};

export default RenderRoutes;
