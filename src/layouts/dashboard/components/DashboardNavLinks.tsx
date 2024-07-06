import React from "react"
import List, { ListProps } from "@mui/material/List";
import { NavLink, } from "react-router-dom";
import ListItem, { ListItemProps } from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { NavigationRecord } from "@/shared/types/navigation";
import { forwardRef, useRef, useState } from "react";
import { BsChevronCompactDown, BsChevronCompactRight, } from "react-icons/bs";
import { Typography } from "@mui/material";
import { useActivePath } from "@/shared/hooks/useActivePath";
type Props = {
  fullWidth: boolean;
  items: NavigationRecord[],
  listProps?: ListProps,
  listItemProps?: ListItemProps
};

export const DashboardNavLink = ({ item, fullWidth, listItemProps }: { item: NavigationRecord } & Props) => {
  const isActive = useActivePath();
  const [open, setOpen] = useState(item.path && isActive(item.path))
  const listRef = useRef<HTMLElement | null>(null)
  return <>
    <ListItem {...listItemProps} sx={{ display: 'flex', flexDirection: 'column', ...listItemProps?.sx, py: 0.5 }}>
      <NavLink onClick={() => setOpen(!open)} className='w-full' to={{ pathname: item.path }} end key={item.path}>
        {({ isActive, }) => {
          return (
            <ListItemButton

              sx={({ palette }) => ({
                py: 0.8,
                pl: 2,
                pr: 0.5,

                minHeight: 45,
                transition: '0.2s',
                borderRadius: '0.2rem',
                color: item.path && isActive ? palette.text.primary : "white",

                "&.Mui-selected , &.Mui-selected:hover": {
                  color: palette.primary.main,
                  "::after": ({ palette }) => ({
                    content: "''",
                    background: palette.primary.main,
                    width: '5px',
                    position: 'absolute',
                    height: '100%',
                    left: '0',
                    borderRadius: '0.2rem 0.2rem 0.2rem 0.2rem'
                  })
                },
              })}
              selected={!!item.path && isActive}
            >

              <ListItemIcon
                sx={(t) => ({
                  minWidth: 40,
                  color: t.palette.mode === 'dark' ? 'inherit' : (isActive && !!item.path) ? t.palette.primary.main : 'inherit'
                })}
              >

                <item.icon size={"1.4rem"} />
              </ListItemIcon>
              {fullWidth && <Typography flexGrow={1} fontWeight={500} fontSize={14}>{item.text}</Typography>}

              {

                fullWidth && item.childrens && (

                  open ? <BsChevronCompactDown /> :
                    <BsChevronCompactRight />
                )
              }


            </ListItemButton>
          );
        }}
      </NavLink>
      {
        item.childrens &&
        // fullWidth && open &&
        <DashboardNavLinks
          ref={listRef}
          listProps={{
            sx: {
              py: 0, maxHeight: open ? listRef.current?.scrollHeight : 0, overflow: 'hidden', transition: '0.35s',
            },
          }}
          listItemProps={{ sx: { px: 0, pl: 0.5 } }}
          fullWidth={fullWidth} items={item.childrens}></DashboardNavLinks>
      }
    </ListItem >

  </>
}




const DashboardNavLinks = forwardRef((props: Props, ref: React.Ref<HTMLElement>) => {

  return (
    <List component='ul' ref={ref} {...props.listProps} sx={{ width: '100%', py: 0, ...props.listProps?.sx, }}>
      {props.items.map((item, i) => (
        <DashboardNavLink key={item.text + item.path + i} item={item} {...props}></DashboardNavLink>
      ))}
    </List>
  );
})


export default DashboardNavLinks;