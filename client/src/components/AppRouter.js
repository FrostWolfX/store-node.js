import React from "react";
import {
    Routes, //был Switch и component изменили на element
    Route,
    Navigate //был Redirect
} from 'react-router-dom'
import { authRoutes, publicRoutes } from "../routes";
import { SHOP_ROUTE } from "../utils/consts";

const AppRouter = () => {
    const isAuth = false;
    return (
        <Routes>
            {isAuth && authRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            <Navigate to={SHOP_ROUTE} replace={true} />
        </Routes>
    );
}

export default AppRouter;
