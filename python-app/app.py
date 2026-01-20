import pygame
import math
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg

# --- Constants ---
G = 9.81
SCALE = 10  
MARGIN = 50
WIDTH, HEIGHT = 900, 700 

class ProjectileSim:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Projectile Motion - Python Edition")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont("Arial", 14, bold=True)
        
        self.v0 = 25.0 # Increased default for better visibility
        self.angle_deg = 45.0
        self.running = True
        self.trail_points = [] # List to store the path
        
        self.reset_projectile()
        self.update_graph()

    def reset_projectile(self):
        """Resets the moving ball and clears the trail"""
        angle_rad = math.radians(self.angle_deg)
        self.x = 0
        self.y = 0
        self.vx = self.v0 * math.cos(angle_rad)
        self.vy = self.v0 * math.sin(angle_rad)
        
        # CRITICAL FIX: Update to the current real time to avoid 'time jumps'
        self.last_update = pygame.time.get_ticks() 
        
        self.landed = False
        self.trail_points = [] # Clear the old path

    def update_graph(self):
        angle_rad = math.radians(self.angle_deg)
        t_total = (2 * self.v0 * math.sin(angle_rad)) / G
        times = [t * 0.05 for t in range(int(t_total / 0.05) + 2)]
        x_pts = [self.v0 * math.cos(angle_rad) * t for t in times]
        y_pts = [self.v0 * math.sin(angle_rad) * t - 0.5 * G * t**2 for t in times]
        
        final_x = [x for x, y in zip(x_pts, y_pts) if y >= 0]
        final_y = [y for y in y_pts if y >= 0]

        fig, ax = plt.subplots(figsize=(8, 3), dpi=100)
        ax.plot(final_x, final_y, color='#4A90E2', lw=2)
        ax.set_facecolor('#F8F9FA')
        ax.set_title("Theoretical Trajectory")
        
        if final_y:
            peak_y = max(final_y)
            peak_x = final_x[final_y.index(peak_y)]
            ax.scatter(peak_x, peak_y, color='#DC3545', zorder=5)
            ax.scatter(final_x[-1], 0, color='#28A745', zorder=5)

        canvas = FigureCanvasAgg(fig)
        canvas.draw()
        self.graph_surf = pygame.image.frombuffer(canvas.buffer_rgba(), canvas.get_width_height(), "RGBA")
        plt.close(fig)

    def handle_input(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.reset_projectile()
                if event.key == pygame.K_UP:
                    self.v0 += 2
                    self.update_graph()
                    self.reset_projectile()
                if event.key == pygame.K_DOWN:
                    self.v0 = max(2, self.v0 - 2)
                    self.update_graph()
                    self.reset_projectile()

    def update_physics(self):
        if self.landed:
            return
            
        now = pygame.time.get_ticks()
        dt = (now - self.last_update) / 1000.0
        self.last_update = now

        # Only update if some time has actually passed
        if dt > 0:
            self.vy -= G * dt
            self.x += self.vx * dt
            self.y += self.vy * dt

            # Add current position to trail
            self.trail_points.append((self.x, self.y))

            if self.y <= 0:
                self.y = 0
                self.landed = True

    def draw(self):
        sim_height = 350
        self.screen.fill((255, 255, 255))
        
        # Draw Sky and Ground
        pygame.draw.rect(self.screen, (200, 230, 255), (0, 0, WIDTH, sim_height))
        pygame.draw.rect(self.screen, (100, 80, 60), (0, sim_height, WIDTH, 50))
        
        # Draw Trajectory Trail
        if len(self.trail_points) > 1:
            points = [(MARGIN + p[0]*SCALE, sim_height - p[1]*SCALE) for p in self.trail_points]
            pygame.draw.lines(self.screen, (255, 255, 255), False, points, 2)
        
        # Draw Projectile
        draw_x = MARGIN + (self.x * SCALE)
        draw_y = sim_height - (self.y * SCALE)
        
        if draw_x < WIDTH:
            # Subtle shadow on ground
            pygame.draw.ellipse(self.screen, (50, 50, 50), (draw_x-5, sim_height-5, 15, 5))
            # Ball
            pygame.draw.circle(self.screen, (255, 100, 0), (int(draw_x), int(draw_y)), 8)

        # UI and Graph
        self.screen.blit(self.graph_surf, (MARGIN, sim_height + 60))
        controls_text = f"Velocity: {self.v0} m/s | [SPACE] Replay | [UP/DOWN] Change Speed"
        text_surf = self.font.render(controls_text, True, (50, 50, 50))
        self.screen.blit(text_surf, (20, 20))
        
        pygame.display.flip()

    def run(self):
        while self.running:
            self.handle_input()
            self.update_physics()
            self.draw()
            self.clock.tick(60)
        pygame.quit()

if __name__ == "__main__":
    ProjectileSim().run()