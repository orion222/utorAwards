import { Box } from "@mui/material";

function LandingBackground({ children }) {
    return (
        <Box 
        height="100vh" 
        sx={{ 
            overflow: "hidden",
            background: `linear-gradient(135deg, #7CD93A20 0%, #F59B6620 50%, #BBA3E520 100%)`,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}
        >
        {/* Animated Background Elements */}
        <Box
            sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 1
            }}
        >
            {/* Floating Circles */}
            {[...Array(6)].map((_, i) => (
            <Box
                key={i}
                sx={{
                position: "absolute",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${
                    ["#7CD93A", "#F59B66", "#BBA3E5", "#7DA4F2"][i % 4]
                }30, ${
                    ["#7CD93A", "#F59B66", "#BBA3E5", "#7DA4F2"][i % 4]
                }10)`,
                animation: `float${i} ${15 + i * 2}s ease-in-out infinite`,
                width: { xs: 60, md: 100 + i * 20 },
                height: { xs: 60, md: 100 + i * 20 },
                top: `${10 + i * 15}%`,
                left: `${5 + i * 15}%`,
                "@keyframes float0": {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(-20px) rotate(180deg)" },
                },
                "@keyframes float1": {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(-30px) rotate(-180deg)" },
                },
                "@keyframes float2": {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(-15px) rotate(90deg)" },
                },
                "@keyframes float3": {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(-25px) rotate(-90deg)" },
                },
                "@keyframes float4": {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(-35px) rotate(270deg)" },
                },
                "@keyframes float5": {
                    "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
                    "50%": { transform: "translateY(-10px) rotate(-270deg)" },
                },
                }}
            />
            ))}

            {/* Trophy Icons */}
            {[...Array(3)].map((_, i) => (
            <Box
                key={`trophy-${i}`}
                sx={{
                position: "absolute",
                fontSize: { xs: 24, md: 32 },
                opacity: 0.1,
                animation: `drift${i} ${20 + i * 5}s linear infinite`,
                top: `${20 + i * 30}%`,
                right: `${10 + i * 20}%`,
                "@keyframes drift0": {
                    "0%": { transform: "translateX(100px) translateY(0px)" },
                    "100%": { transform: "translateX(-100px) translateY(-50px)" },
                },
                "@keyframes drift1": {
                    "0%": { transform: "translateX(80px) translateY(0px)" },
                    "100%": { transform: "translateX(-80px) translateY(30px)" },
                },
                "@keyframes drift2": {
                    "0%": { transform: "translateX(120px) translateY(0px)" },
                    "100%": { transform: "translateX(-120px) translateY(-20px)" },
                },
                }}
            >
                🏆
            </Box>
            ))}

            {/* Star Icons */}
            {[...Array(4)].map((_, i) => (
            <Box
                key={`star-${i}`}
                sx={{
                position: "absolute",
                fontSize: { xs: 16, md: 20 },
                opacity: 0.15,
                animation: `twinkle ${2 + i * 0.5}s ease-in-out infinite`,
                top: `${15 + i * 20}%`,
                left: `${80 + i * 5}%`,
                "@keyframes twinkle": {
                    "0%, 100%": { opacity: 0.15, transform: "scale(1)" },
                    "50%": { opacity: 0.4, transform: "scale(1.2)" },
                },
                }}
            >
                ⭐
            </Box>
            ))}

            {/* Gift Icons */}
            {[...Array(2)].map((_, i) => (
            <Box
                key={`gift-${i}`}
                sx={{
                position: "absolute",
                fontSize: { xs: 20, md: 28 },
                opacity: 0.1,
                animation: `bounce ${3 + i}s ease-in-out infinite`,
                bottom: `${20 + i * 40}%`,
                left: `${5 + i * 10}%`,
                "@keyframes bounce": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-15px)" },
                },
                }}
            >
                🎁
            </Box>
            ))}
        </Box>

        {children}

      </Box>
    );
}

export default LandingBackground;