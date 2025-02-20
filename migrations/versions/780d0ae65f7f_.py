"""empty message

Revision ID: 780d0ae65f7f
Revises: 
Create Date: 2025-01-26 22:24:52.895720

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '780d0ae65f7f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('files',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('Parcel', sa.String(length=255), nullable=True),
    sa.Column('Acres', sa.String(length=255), nullable=True),
    sa.Column('County', sa.String(length=255), nullable=True),
    sa.Column('Owner', sa.String(length=255), nullable=True),
    sa.Column('Range', sa.String(length=255), nullable=True),
    sa.Column('Section', sa.String(length=255), nullable=True),
    sa.Column('StartingBid', sa.String(length=255), nullable=True),
    sa.Column('State', sa.String(length=255), nullable=True),
    sa.Column('Township', sa.String(length=255), nullable=True),
    sa.Column('Filename', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('property',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('parcel_number', sa.String(length=50), nullable=False),
    sa.Column('owner', sa.String(length=120), nullable=True),
    sa.Column('year_built', sa.Integer(), nullable=True),
    sa.Column('building_SQFT', sa.String(length=100), nullable=True),
    sa.Column('building_count', sa.String(length=50), nullable=True),
    sa.Column('acre', sa.Float(), nullable=True),
    sa.Column('acre_sqft', sa.Float(), nullable=True),
    sa.Column('address', sa.String(length=200), nullable=True),
    sa.Column('mail_address', sa.String(length=200), nullable=True),
    sa.Column('mail_city', sa.String(length=50), nullable=True),
    sa.Column('mail_state', sa.String(length=50), nullable=True),
    sa.Column('mail_zip', sa.String(length=20), nullable=True),
    sa.Column('mail_country', sa.String(length=50), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=True),
    sa.Column('longitude', sa.Float(), nullable=True),
    sa.Column('zip_code', sa.String(length=50), nullable=True),
    sa.Column('improvement_value', sa.Float(), nullable=True),
    sa.Column('land_value', sa.Float(), nullable=True),
    sa.Column('parcel_value', sa.Float(), nullable=True),
    sa.Column('zoning', sa.String(length=50), nullable=True),
    sa.Column('county', sa.String(length=50), nullable=True),
    sa.Column('state', sa.String(length=50), nullable=True),
    sa.Column('legal_description', sa.String(length=180), nullable=True),
    sa.Column('fema_flood_zone', sa.JSON(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('last_name', sa.Text(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_admin', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    op.drop_table('property')
    op.drop_table('files')
    # ### end Alembic commands ###
