import {motion} from 'framer-motion';

function Overlay({children, close}){
    const variants = {
        open: { backgroundColor: "rgba(0, 0, 0, 0.3)"},
        closed: { backgroundColor: "rgba(0, 0, 0, 0)"}
    }
    return (
        <motion.div className="overlay" variants={variants} initial={"closed"} exit={"closed"} animate={"open"}>
            {children}
        </motion.div>
    )
};

export default Overlay;