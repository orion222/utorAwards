import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  Grid,
  Container,
  Chip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Trophy,
  Users,
  Calendar,
  Gift,
  Star,
  TrendingUp,
  Award,
  ChevronRight
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useEffect, useRef, useState } from "react";
import UserCard from "../../components/common/UserCard";
import { testimonials, stats } from "./constants.js";

function Landing() {
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const trackRef = useRef(null);
  const autoScrollRef = useRef({ rafId: null, pausedUntil: 0, offsetPx: 0 });

  if (user) {
    return <Navigate to="/dashboard" />;
  }
  // Auto-scroll the testimonial track slowly; wrap seamlessly
  useEffect(() => {
    const speedPxPerSec = 20; // very slow
    const duplicateCount = 2; // we render testimonials twice for seamless loop

    const step = (ts) => {
      const now = ts || performance.now();
      const isPaused = now < autoScrollRef.current.pausedUntil;
      const track = trackRef.current;
      if (!track) {
        autoScrollRef.current.rafId = requestAnimationFrame(step);
        return;
      }

      const containerWidth = track.parentElement?.clientWidth || 0;
      const itemWidth = containerWidth; // each slide is 100% width
      const totalItems = testimonials.length * duplicateCount;
      const totalWidthPx = itemWidth * totalItems;

      if (!isPaused) {
        autoScrollRef.current.offsetPx += (speedPxPerSec / 60); // ~60fps
        if (autoScrollRef.current.offsetPx >= totalWidthPx / 2) {
          // wrap at half, since duplicated once (seamless)
          autoScrollRef.current.offsetPx = 0;
        }
        track.style.transform = `translateX(-${autoScrollRef.current.offsetPx}px)`;
      }

      autoScrollRef.current.rafId = requestAnimationFrame(step);
    };

    autoScrollRef.current.rafId = requestAnimationFrame(step);
    return () => {
      if (autoScrollRef.current.rafId) cancelAnimationFrame(autoScrollRef.current.rafId);
    };
  }, [testimonials.length]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", position: "relative" }}>
      
       {/* NEW: UTORAwards Badge at top right */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: { xs: 16, md: 24 }, 
          right: { xs: 16, md: 24 }, 
          zIndex: 100 
        }}
      >
        <Chip
          icon={<Trophy size={16} color="white" />} 
          label="UTORAWARDS" 
          sx={{ 
            backgroundColor: "#1E3765",
            color: "white",
            fontSize: { xs: "0.5rem", md: "1rem" },
            padding: { xs: '6px 12px', md: '1.5rem 2rem' },
            fontWeight: 700,
            boxShadow: 2,
            height: 32
          }} 
        />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
          py: { xs: 8, md: 12 },
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                <Box>
                  <Chip
                    label="✨ New Platform Launch"
                    sx={{
                      mb: 2,
                      bgcolor: theme.palette.primary.main + '20',
                      color: theme.palette.primary.dark,
                      fontWeight: 600
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      lineHeight: 1.1,
                      color: "text.primary",
                      mb: 2,
                      textAlign: { xs: "center", md: "left" }
                    }}
                  >
                    Unlock Your
                    <Box component="span" sx={{ color: "primary.main", display: "block" }}>
                      Campus Potential
                    </Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                      fontWeight: 400,
                      maxWidth: 500,
                      mx: { xs: "auto", md: 0 },
                      textAlign: { xs: "center", md: "left" }
                    }}
                  >
                    Join the ultimate student rewards ecosystem. Earn points for every campus activity,
                    unlock exclusive rewards, and climb the leaderboard while making your university experience unforgettable.
                  </Typography>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ChevronRight />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      bgcolor: "primary.main",
                      "&:hover": { bgcolor: "primary.dark" },
                      borderRadius: 2,
                    }}
                    component={Link}
                    to="/login"
                  >
                    Start Earning Points
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        bgcolor: "primary.main" + "10"
                      },
                      borderRadius: 2,
                    }}
                    href="#features"
                  >
                    Learn More
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: "center" }}>
                <Paper
                  elevation={0}
                  sx={{
                    width: { xs: 200, md: 300 },
                    height: { xs: 200, md: 300 },
                    mx: "auto",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "primary.main",
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 20px 60px ${theme.palette.primary.main}40`,
                  }}
                >
                  <Trophy size={isMobile ? 80 : 120} color="white" strokeWidth={1.5} />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 10, px: 3, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              fontWeight: 700,
              mb: 6,
              color: "text.primary"
            }}
          >
            Join Thousands of Active Students
          </Typography>

          {/* CHANGED: Converted to CSS Grid to prevent staggering on mobile */}
          <Box
            sx={{
              display: "grid",
              // Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 4, // 32px gap
              alignItems: "stretch"
            }}
          >
            {stats.map((stat, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.custom.border}`,
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  }
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 2,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: stat.color + "20",
                  }}
                >
                  <stat.icon size={32} color={stat.color} strokeWidth={2} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: stat.color,
                    mb: 1
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500
                  }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 8, px: 3 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "text.primary"
            }}
          >
            Everything You Need to Succeed
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              color: "text.secondary",
              mb: 8,
              maxWidth: 600,
              mx: "auto"
            }}
          >
            Discover events, earn rewards, and compete with fellow students in an engaging campus ecosystem
          </Typography>

          <Box
            sx={{
              maxWidth: 1000,
              mx: "auto",
              display: "grid",
              // Strict enforcement: 1 column on mobile, 2 columns on medium+
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4, // 32px gap
            }}
          >
            {[
              {
                icon: Calendar,
                title: "Smart Event Discovery",
                description: "Find the perfect campus events tailored to your interests and schedule",
                color: "#7CD93A"
              },
              {
                icon: Award,
                title: "Instant Point Rewards",
                description: "Earn points for every event attendance, activity participation, and milestone achieved",
                color: "#F59B66"
              },
              {
                icon: Gift,
                title: "Exclusive Redemptions",
                description: "Unlock premium rewards, discounts, and experiences with your earned points",
                color: "#BBA3E5"
              },
              {
                icon: Star,
                title: "Competitive Leaderboards",
                description: "Compete with peers and climb the rankings to showcase your campus involvement",
                color: "#7DA4F2"
              }
            ].map((feature, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 3, // Reduced padding to tighten layout
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.custom.border}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    mb: 2, // Reduced margin
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: feature.color + "20",
                  }}
                >
                  <feature.icon size={28} color={feature.color} strokeWidth={2} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 1, // Reduced margin
                    color: "text.primary"
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.5
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, px: 3, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "text.primary"
            }}
          >
            What Students Are Saying
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              color: "text.secondary",
              mb: 6
            }}
          >
            Real experiences from our campus community
          </Typography>

          <Box sx={{ position: "relative", overflow: "hidden", maxWidth: 800, mx: "auto" }}>
            {/* Continuous scrolling track with duplicated items for seamless loop */}
            <Box
              ref={trackRef}
              sx={{
                display: "flex",
                minHeight: 250,
                willChange: "transform",
                transition: "transform 500ms ease", // used when jumping via dots
              }}
            >
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <Box
                  key={index}
                  sx={{
                    minWidth: "100%",
                    // Kept compact padding on desktop (md: 1 = 8px)
                    px: { xs: 3, md: 1 }, 
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={6}>
                      {/* Added pointerEvents: none to disable link click on UserCard */}
                      <Box sx={{ maxWidth: 400, mx: { xs: "auto", md: 0 }, pointerEvents: "none" }}>
                        <UserCard user={testimonial} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 4,
                          borderRadius: 3,
                          border: `1px solid ${theme.palette.custom.border}`,
                          position: "relative",
                          textAlign: "center",
                          maxWidth: 520,
                          mx: { xs: "auto", md: 0 },
                          "&::before": {
                            content: '"“"',
                            position: "absolute",
                            top: 12,
                            left: 16,
                            fontSize: "2.5rem",
                            color: theme.palette.primary.main,
                            fontFamily: "serif",
                            lineHeight: 1,
                            pointerEvents: "none",
                          }
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontStyle: "italic",
                            color: "text.primary",
                            lineHeight: 1.6,
                            pl: 4,
                          }}
                        >
                          {testimonial.testimonial}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Testimonial Navigation Dots */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 1 }}>
            {testimonials.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: currentTestimonial === index ? "primary.main" : "custom.border",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onClick={() => {
                  setCurrentTestimonial(index);
                  const containerWidth = trackRef.current?.parentElement?.clientWidth || 0;
                  const offsetPx = containerWidth * index;
                  autoScrollRef.current.offsetPx = offsetPx; // jump to selected slide
                  if (trackRef.current) {
                    trackRef.current.style.transform = `translateX(-${offsetPx}px)`;
                  }
                  // Pause autoscroll briefly to let user read
                  autoScrollRef.current.pausedUntil = performance.now() + 4000;
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          px: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={4} textAlign="center" alignItems="center">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Ready to Transform Your Campus Experience?
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                maxWidth: 500,
                mx: "auto"
              }}
            >
              Join thousands of students who are already earning points, discovering events, and unlocking amazing rewards.
            </Typography>

            <Button
              variant="contained"
              size="large"
              endIcon={<Trophy size={20} />}
              sx={{
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 700,
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
                borderRadius: 3,
                alignSelf: "center",
              }}
              component={Link}
              to="/login"
            >
              Start Your Journey Today
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default Landing;