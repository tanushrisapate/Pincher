import logging
from contextlib import contextmanager
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import RealDictCursor
from app.core.config import settings

logger = logging.getLogger(__name__)

pool: ThreadedConnectionPool = None

def get_db_pool() -> ThreadedConnectionPool:
    global pool
    if pool is None:
        try:
            pool = ThreadedConnectionPool(
                minconn=1,
                maxconn=20,
                dsn=settings.DATABASE_URL
            )
            logger.info("PostgreSQL ThreadedConnectionPool initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to connect to PostgreSQL: {e}")
            # Fallback using individual parameters
            pool = ThreadedConnectionPool(
                minconn=1,
                maxconn=20,
                host=settings.PGHOST,
                port=settings.PGPORT,
                user=settings.PGUSER,
                password=settings.PGPASSWORD,
                database=settings.PGDATABASE
            )
    return pool

@contextmanager
def get_db_cursor(commit=False):
    db_pool = get_db_pool()
    conn = db_pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            yield cur
            if commit:
                conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Database error: {e}")
        raise e
    finally:
        db_pool.putconn(conn)

def init_db():
    """Create all required tables if they do not exist."""
    schema_sql = """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        persona VARCHAR(50) DEFAULT 'classic',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS wardrobe_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(100),
        color_hex VARCHAR(20) DEFAULT '#000000',
        color_name VARCHAR(50),
        season VARCHAR(50) DEFAULT 'all',
        occasion VARCHAR(50) DEFAULT 'casual',
        image_url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS outfit_collections (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        top_item_id INTEGER REFERENCES wardrobe_items(id) ON DELETE SET NULL,
        bottom_item_id INTEGER REFERENCES wardrobe_items(id) ON DELETE SET NULL,
        outerwear_item_id INTEGER REFERENCES wardrobe_items(id) ON DELETE SET NULL,
        shoes_item_id INTEGER REFERENCES wardrobe_items(id) ON DELETE SET NULL,
        accessory_item_id INTEGER REFERENCES wardrobe_items(id) ON DELETE SET NULL,
        occasion VARCHAR(50) DEFAULT 'daily',
        season VARCHAR(50) DEFAULT 'all',
        weather_temp REAL,
        weather_condition VARCHAR(100),
        harmony_score REAL DEFAULT 85.0,
        explanation TEXT,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_wardrobe_user ON wardrobe_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_wardrobe_cat ON wardrobe_items(category);
    CREATE INDEX IF NOT EXISTS idx_outfits_user ON outfit_collections(user_id);
    """
    with get_db_cursor(commit=True) as cur:
        cur.execute(schema_sql)
        logger.info("Database schema initialized and verified.")
